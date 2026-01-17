#!/bin/bash
# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Run the backend
cd backend
mvn spring-boot:run
