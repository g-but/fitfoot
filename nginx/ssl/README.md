# SSL Certificates

This directory should contain your SSL certificates for production deployment.

## Required Files

- `cert.pem` - Your SSL certificate
- `key.pem` - Your private key

## Setup Instructions

1. Place your SSL certificate files in this directory
2. Ensure file permissions are secure (600 for key.pem)
3. Update the nginx configuration if needed

## Development

For development, you can use self-signed certificates or disable SSL by modifying the nginx configuration.
