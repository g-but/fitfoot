#!/bin/bash

# FitFoot Development Environment Setup
# This script sets up the 'd' command alias for quick development startup

echo "🚀 Setting up FitFoot development environment alias..."

# Get the current directory (should be the project root)
PROJECT_ROOT="$(pwd)"
SCRIPT_PATH="$PROJECT_ROOT/scripts/dev-dashboard.js"

# Check if the script exists
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Error: dev-dashboard.js not found at $SCRIPT_PATH"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Function to add function to shell config
add_function_to_shell() {
    local shell_config="$1"
    local function_block="# FitFoot Development Environment
d() {
    node \"$SCRIPT_PATH\"
}"
    
    if [ -f "$shell_config" ]; then
        # Check if function already exists
        if grep -q "d()" "$shell_config"; then
            echo "📝 Updating existing 'd' function in $shell_config"
            # Remove existing function and add new one
            sed -i.bak '/# FitFoot Development Environment/,/^}/d' "$shell_config"
            echo "" >> "$shell_config"
            echo "$function_block" >> "$shell_config"
        else
            echo "📝 Adding 'd' function to $shell_config"
            echo "" >> "$shell_config"
            echo "$function_block" >> "$shell_config"
        fi
    else
        echo "📝 Creating $shell_config with 'd' function"
        echo "$function_block" > "$shell_config"
    fi
}

# Detect shell and add function
if [ "$SHELL" = "/bin/bash" ] || [ "$SHELL" = "/usr/bin/bash" ]; then
    add_function_to_shell "$HOME/.bashrc"
    echo "✅ Added function to ~/.bashrc"
elif [ "$SHELL" = "/bin/zsh" ] || [ "$SHELL" = "/usr/bin/zsh" ]; then
    add_function_to_shell "$HOME/.zshrc"
    echo "✅ Added function to ~/.zshrc"
elif [ "$SHELL" = "/bin/fish" ] || [ "$SHELL" = "/usr/bin/fish" ]; then
    # Fish shell uses different syntax
    mkdir -p "$HOME/.config/fish/functions"
    echo "function d
    node \"$SCRIPT_PATH\"
end" > "$HOME/.config/fish/functions/d.fish"
    echo "✅ Added function to Fish shell"
else
    echo "⚠️  Unknown shell: $SHELL"
    echo "   Please manually add this function to your shell config:"
    echo "   d() { node \"$SCRIPT_PATH\"; }"
fi

# Add project directory to PATH for easy 'd' command access
PATH_LINE="export PATH=\"$PROJECT_ROOT:\$PATH\""

if [ -f "$HOME/.bashrc" ]; then
    if ! grep -q "export PATH.*$PROJECT_ROOT" "$HOME/.bashrc"; then
        echo "📝 Adding project directory to PATH in ~/.bashrc"
        echo "" >> "$HOME/.bashrc"
        echo "# FitFoot Project PATH" >> "$HOME/.bashrc"
        echo "$PATH_LINE" >> "$HOME/.bashrc"
    fi
fi

# Also add to current session
export PATH="$PROJECT_ROOT:$PATH"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Quick Start:"
echo "   1. Reload your shell: source ~/.bashrc (or ~/.zshrc)"
echo "   2. Navigate to your project directory"
echo "   3. Type 'd' and press Enter"
echo ""
echo "🎛️  Dashboard Features:"
echo "   • Starts all development servers (Next.js, Medusa, Sanity)"
echo "   • Shows live service status with health checks"
echo "   • Provides direct links to all admin interfaces"
echo "   • Includes comprehensive testing guidelines"
echo "   • Interactive keyboard shortcuts for management"
echo ""
echo "⚡ Available Commands in Dashboard:"
echo "   [h] Show/hide dashboard    [r] Restart all services"
echo "   [s] Check service status   [q] Quit all services"
echo "   [Ctrl+C] Emergency exit"
echo ""

# Try to test the alias in current session
echo "🧪 Testing alias in current session..."
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js is available"
    echo "✅ You can now type 'd' to start the development environment"
    echo ""
    echo "💡 Tip: Run 'd' from your project root directory for best results"
else
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo ""
echo "🔗 Quick Links (when servers are running):"
echo "   Frontend:      http://localhost:3005"
echo "   Admin Panel:   http://localhost:3005/admin"
echo "   Shop:          http://localhost:3005/shop"
echo "   Medusa API:    http://localhost:9000"
echo "   Medusa Admin:  http://localhost:9000/app"
echo "   Sanity Studio: http://localhost:3334"
echo "" 