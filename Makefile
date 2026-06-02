.PHONY: dev test build lint typecheck db-push db-seed db-studio docker-up docker-down clean

# Default target
default: dev

# Development
dev:
	npm run dev

# Testing
test:
	npm test

test-watch:
	npm test -- --watch

# Type checking
typecheck:
	npm run typecheck

# Linting
lint:
	npm run lint

lint-fix:
	npm run lint -- --fix

# Build
build:
	npm run build

# Database
db-push:
	npx prisma db push

db-seed:
	npx prisma db seed

db-studio:
	npx prisma studio

# Docker
docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# MCP Server (stdio transport)
mcp-server:
	npx ts-node src/mcp/server.ts

# Clean
clean:
	rm -rf .next node_modules
	npm install

# Install n8n node locally
n8n-link:
	cd n8n && npm link && cd .. && npm link n8n-nodes-mcp-sales-agent
