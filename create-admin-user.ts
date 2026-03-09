import { MedusaApp } from "@medusajs/framework"

async function createAdminUser() {
  try {
    console.log("🔐 Creating FitFoot Admin User...")
    
    const app = await MedusaApp({
      loadEnv: false
    })
    
    const userService = app.resolve("userModuleService")
    
    // Create admin user
    const adminUser = await userService.createUsers({
      email: "admin@fitfoot.ch",
      first_name: "FitFoot",
      last_name: "Admin",
      avatar_url: null,
      metadata: {
        role: "admin",
        created_via: "setup_script"
      }
    })
    
    console.log("✅ Admin user created successfully!")
    console.log("📧 Email: admin@fitfoot.ch")
    console.log("🆔 User ID:", adminUser.id)
    console.log("\n🔑 Next steps:")
    console.log("1. Set password through admin interface")
    console.log("2. Access admin at: http://localhost:9000/admin")
    console.log("3. Create publishable API keys")
    
    return adminUser
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error)
    
    // If user already exists, that's fine
    if (error.message && error.message.includes("already exists")) {
      console.log("ℹ️ Admin user already exists")
      return null
    }
    
    throw error
  }
}

createAdminUser()
  .then(() => {
    console.log("🎉 Admin user setup completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Setup failed:", error)
    process.exit(1)
  }) 