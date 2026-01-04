#!/bin/bash

# Test script cho Auth và User API
BASE_URL="http://localhost:8080"
COOKIE_FILE="/tmp/cookies.txt"

echo "=== TEST AUTH & USER API ==="
echo ""

# 1. Test Login
echo "1. Testing LOGIN..."
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "admin123"
  }' \
  -c $COOKIE_FILE \
  -s | jq .

echo ""
echo "Cookies saved to $COOKIE_FILE"
echo ""

# 2. Test Get All Users
echo "2. Testing GET ALL USERS..."
curl -X GET "$BASE_URL/nguoi-quan-ly" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -s | jq .

echo ""

# 3. Test Get Users with Filters
echo "3. Testing GET USERS WITH FILTERS (VAITRO=admin_1)..."
curl -X GET "$BASE_URL/nguoi-quan-ly?VAITRO=admin_1" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -s | jq .

echo ""

# 4. Test Get User by ID
echo "4. Testing GET USER BY ID (id=1)..."
curl -X GET "$BASE_URL/nguoi-quan-ly/1" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -s | jq .

echo ""

# 5. Test Update Current User
echo "5. Testing UPDATE CURRENT USER..."
curl -X PUT "$BASE_URL/nguoi-quan-ly" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -d '{
    "HOTEN": "Admin Updated"
  }' \
  -s | jq .

echo ""

# 6. Test Refresh Token
echo "6. Testing REFRESH TOKEN..."
curl -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -c $COOKIE_FILE \
  -s | jq .

echo ""

# 7. Test Logout
echo "7. Testing LOGOUT..."
curl -X POST "$BASE_URL/auth/logout" \
  -H "Content-Type: application/json" \
  -b $COOKIE_FILE \
  -s | jq .

echo ""
echo "=== TEST COMPLETED ==="
echo "Cookie file: $COOKIE_FILE"
