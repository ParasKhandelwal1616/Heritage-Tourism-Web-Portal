const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");

// Load env before any other imports
dotenv.config({ path: path.join(__dirname, "../.env.local") });

async function fix() {
  try {
    console.log("Connecting to database...");
    // Import after env is loaded
    const dbConnect = require("../src/lib/db").default;
    const User = require("../src/models/User").default;
    
    await dbConnect();
    
    const email = "23cd10pa41@mitsgwl.ac.in";
    const plainPassword = "Paras@11";
    const hashedPassword = await bcrypt.hash(plainPassword, 12);
    
    console.log(`Setting ${email} as ADMIN...`);
    
    await User.findOneAndUpdate(
      { email },
      { 
        name: "Admin Paras",
        password: hashedPassword,
        role: "ADMIN" 
      },
      { upsert: true, new: true }
    );
    
    console.log("✅ Admin account fixed! You can now log in at http://localhost:3000/auth/signin");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fix();
