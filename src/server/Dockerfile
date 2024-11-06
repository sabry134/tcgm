# Use an official Golang runtime as a parent image
FROM golang:1.23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the go.mod and go.sum files and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application code
COPY . .

# Build the Go app
RUN go build -o server .

# Expose the port the app runs on
EXPOSE 12345

# Run the server executable
CMD ["./server/server"]
