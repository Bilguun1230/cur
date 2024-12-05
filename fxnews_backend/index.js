const { PrismaClient } = require("@prisma/client")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// const verifyToken = require("./middleware/verifyToken");

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

function findUserByToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, "secret-key", (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        const userId = decoded.userId
        resolve(userId)
      }
    })
  })
}

//const prisma = require('./path/to/prismaClient'); // Ensure correct path to Prisma client

app.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  // Check if required fields are provided
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields (email, password, name) are required" });
  }

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with wallet
    const result = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        wallet: {
          create: {
            accountBalance: 0,
          },
        },
      },
    });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = result;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
});
app.post('/update-user', async (req, res) => {
  const { id, email, name, password } = req.body; // User ID and fields to update

  // Ensure ID and at least one field is provided
  if (!id || (!email && !name && !password)) {
    return res.status(400).json({ message: "User ID and at least one field (email, name, password) are required" });
  }

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update data
    const updateData = {};
    if (email) {
      // Check if the new email is already in use
      const emailInUse = await prisma.user.findUnique({
        where: { email },
      });
      if (emailInUse && emailInUse.id !== parseInt(id)) {
        return res.status(400).json({ message: "Email already in use" });
      }
      updateData.email = email;
    }
    if (name) {
      updateData.name = name;
    }
    if (password) {
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    // Exclude password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user information" });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email: email  } })

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" })
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return res.status(401).json({ message: "password" })
  }

  const token = jwt.sign({ userId: user.id }, "secret-key", {
    expiresIn: "7d",
  })
  res.json({ token })
})

app.get("/getusers", async (req, res) => {
  const user = await prisma.user.findMany()
  res.json({ user })
})

app.get("/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1] 
  try {
    const userId = await findUserByToken(token)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        music: {
          orderBy: { createdAt: "desc" },
        },
      },
    })
    res.json(user)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.post("/updateWallet", async (req, res) => {
  const token = req.headers.token
  try {
    const { data } = req.body
    const userId = await findUserByToken(token)

    const wallet = await prisma.wallet.update({
      where: {
        userId: userId
      },
      data: {
        accountBalance: data?.balanceType === "WITHDRAW"
          ? { decrement: data?.accountBalance }
          : { increment: data?.accountBalance }
          ,
          walletHistories: {
            create: {
              balanceType: data?.balanceType,
              balance: data?.accountBalance
            }
          }
      }
    })
    res.json(wallet)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.get("/wallet", async (req, res) => {
  const token = req.headers.token
  try {
    const userId = await findUserByToken(token)
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    })
    res.json(wallet)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.get("/walletHistories", async (req, res) => {
  const token = req.headers.token
  try {
    const userId = await findUserByToken(token)
    const wallet = await prisma.walletHistory.findMany({
      where: { wallet: {
        userId
      }},
    })
    res.json(wallet)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.post("/buySell", async (req, res) => {
  const token = req.headers.token;
  try {
    const { data } = req.body;
    const userId = await findUserByToken(token);

    const wallet = await prisma.wallet.findUnique({
      where: { userId: userId }
    });

    if (data?.sell) {
      
      const buySellQ = await prisma.buySell.findFirst({
        where: {
          userId: userId,
          id: data?.id
        }
      });

      if (!buySellQ || buySellQ.buy < data?.sell) {
        return res.status(400).json({ error: "Insufficient quantity to sell" });
      }

      
      await prisma.wallet.update({
        where: {
          userId: userId
        },
        data: {
          accountBalance: { increment: data?.sell }
        }
      });

      
      const sd = await prisma.buySell.update({
        where: {
          id: buySellQ.id
        },
        data: {
          user: {
            connect: { id: userId }
          },
          buy: { decrement: data?.sell },
          buySellHistories: {
            create: {
              sell: data?.sell || 0,
              name: data?.name
            }
          }
        }
      });

      
      if (sd && sd.buy <= 0) {
        console.log("sd", sd)
        await prisma.buySell.delete({
          where: {
            id: sd.id
          }
        });
      }
    } else if (data?.buy) {
      
      if (wallet.accountBalance < data?.buy) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      
      await prisma.wallet.update({
        where: {
          userId: userId
        },
        data: {
          accountBalance: { decrement: data?.buy }
        }
      });

      await prisma.buySell.create({
        data: {
          user: {
            connect: { id: userId }
          },
          buy: data?.buy,
          buyPrice: data?.buyPrice,
          name: data?.name,
          calculatedAmount: data?.calculatedAmount,
          buySellHistories: {
            create: {
              buy: data?.buy || 0,
              name: data?.name
            }
          }
        }
      });
    }

    res.json({ data: true });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
});

app.get("/buySellHistories", async (req, res) => {
  const token = req.headers.token
  try {
    const userId = await findUserByToken(token)
    const wallet = await prisma.buySellHistory.findMany({
      where: {
        buySell: {
          userId
        }
      }
    })
    res.json(wallet)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.get("/buySells", async (req, res) => {
  const token = req.headers.token
  try {
    const userId = await findUserByToken(token)
    const buySells = await prisma.buySell.findMany({
      where: {
        userId
      }
    })
    res.json(buySells)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.get("/buySell", async (req, res) => {
  const { name } = req.query
  const token = req.headers.token
  try {
    const userId = await findUserByToken(token)
    const buySells = await prisma.buySell.findMany({
      where: {
        userId,
        name,
        OR: [{
          buy: {gt: 0}
        }]
      }
    })
    res.json(buySells)
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
  }
})

app.get("/bankCard", async (req, res) => {
  const { bankName } = req.query;
  const token = req.headers.token;

  try {
    const userId = await findUserByToken(token);
    const bankCards = await prisma.bankCard.findMany({
      where: {
        userId,
        ...(bankName && { bankName }), 
      },
    });
    res.json(bankCards);
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token or request" });
  }
});


function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Токен байхгүй байна" });
  }

  jwt.verify(token, "secret-key", (err, user) => {
    if (err) return res.status(403).json({ message: "Буруу токен" });
    req.user = user; // Токен доторх хэрэглэгчийн ID-г хадгална
    next();
  });
}

module.exports = verifyToken;


app.listen(3000, () =>
  console.log('🚀 Server ready at: http://localhost:3000'),
);