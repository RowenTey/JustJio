package services

import (
	"errors"
	"fmt"

	"github.com/RowenTey/SC2006-JustJio/server-ws/utils"
	"github.com/gofiber/websocket/v2"
	"github.com/golang-jwt/jwt"
)

type User struct {
	ID string
}

func GetCurrentUser(c *websocket.Conn) (*User, error) {
	tokenStr := c.Query("token")

	fmt.Println("tokenStr: ", tokenStr)

	// Decode the JWT token
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		return []byte(utils.Config("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	// Extract the user ID from the JWT claims
	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, errors.New("Invalid token claims")
	}

	userID, ok := claims["user_id"].(float64)
	if !ok {
		return nil, errors.New("Invalid user ID")
	}

	user := &User{
		ID: fmt.Sprintf("%v", userID),
	}
	return user, nil
}