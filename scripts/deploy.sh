#!/bin/bash

# Deployment script for Torah Client on Linode Ubuntu server
# This script should be run on the server to set up the deployment environment

set -e

DEPLOY_PATH=${1:-"/var/www/torah-client"}
DOMAIN=${2:-"your-domain.com"}

echo "Setting up deployment for Torah Client at: $DEPLOY_PATH"

# Update system packages
sudo apt update && sudo apt upgrade -y

# Install nginx if not already installed
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt install nginx -y
fi

# Install Node.js (for potential server-side operations)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Create deployment directory
sudo mkdir -p "$DEPLOY_PATH"
sudo chown -R $USER:$USER "$DEPLOY_PATH"

# Create nginx configuration
sudo tee /etc/nginx/sites-available/torah-client << EOF
server {
    listen 80;
    server_name $DOMAIN;
    root $DEPLOY_PATH;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle React Router (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Service worker should not be cached
    location /service-worker.js {
        expires off;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Security: deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/torah-client /etc/nginx/sites-enabled/

# Remove default nginx site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Start and enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Set up SSL with Let's Encrypt (optional)
if command -v certbot &> /dev/null; then
    echo "Setting up SSL certificate..."
    sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

echo "Deployment setup completed successfully!"
echo "Your app will be available at: http://$DOMAIN"
echo "Deployment path: $DEPLOY_PATH"
