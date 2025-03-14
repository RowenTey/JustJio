package handlers

import (
	"log"
	"time"

	"github.com/RowenTey/JustJio/database"
	model_kafka "github.com/RowenTey/JustJio/model/kafka"
	"github.com/RowenTey/JustJio/model/request"
	"github.com/RowenTey/JustJio/model/response"
	"github.com/RowenTey/JustJio/services"
	"github.com/RowenTey/JustJio/util"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

func GetMessage(c *fiber.Ctx) error {
	roomId := c.Params("roomId")
	msgId := c.Params("msgId")

	message, err := (&services.MessageService{DB: database.DB}).GetMessageById(msgId, roomId)
	if err != nil {
		return util.HandleNotFoundOrInternalError(c, err, "No message found")
	}

	return util.HandleSuccess(c, "Retrieved message successfully", message)
}

func GetMessages(c *fiber.Ctx) error {
	roomId := c.Params("roomId")

	page := c.QueryInt("page", 1)
	asc := c.QueryBool("asc", true)

	msgService := &services.MessageService{DB: database.DB}

	messages, err := msgService.GetMessagesByRoomId(roomId, page, asc)
	if err != nil {
		return util.HandleNotFoundOrInternalError(c, err, "No messages found")
	}

	pageCount, err := msgService.CountNumMessagesPages(roomId)
	if err != nil {
		return util.HandleInternalServerError(c, err)
	}

	response := response.GetMessagesResponse{
		Messages:  *messages,
		Page:      page,
		PageCount: pageCount,
	}

	return util.HandleSuccess(c, "Retrieved messages successfully", response)
}

func CreateMessage(c *fiber.Ctx, kafkaSvc *services.KafkaService) error {
	roomId := c.Params("roomId")

	var request request.CreateMessageRequest
	if err := c.BodyParser(&request); err != nil {
		return util.HandleInvalidInputError(c, err)
	}

	token := c.Locals("user").(*jwt.Token)
	userId := util.GetUserInfoFromToken(token, "user_id")

	var err error

	room, err := (&services.RoomService{DB: database.DB}).GetRoomById(roomId)
	if err != nil {
		return util.HandleNotFoundOrInternalError(c, err, "Room not found")
	}

	user, err := (&services.UserService{DB: database.DB}).GetUserByID(userId)
	if err != nil {
		return util.HandleNotFoundOrInternalError(c, err, "User not found")
	}

	err = (&services.MessageService{DB: database.DB}).SaveMessage(room, user, request.Content)
	if err != nil {
		return util.HandleInternalServerError(c, err)
	}

	broadcastPayload := model_kafka.KafkaMessage{
		MsgType: "CREATE_MESSAGE",
		Data: struct {
			RoomID     string `json:"roomId"`
			SenderID   string `json:"senderId"`
			SenderName string `json:"senderName"`
			Content    string `json:"content"`
			SentAt     string `json:"sentAt"`
		}{
			RoomID:     roomId,
			SenderID:   userId,
			SenderName: user.Username,
			Content:    request.Content,
			SentAt:     time.Now().Format(time.RFC3339),
		},
	}

	roomUserIds := c.Locals("roomUserIds").(*[]string)
	if err := kafkaSvc.BroadcastMessage(roomUserIds, broadcastPayload); err != nil {
		log.Println("[MESSAGE] Failed to broadcast message:", err)
	}
	log.Println("[MESSAGE] Broadcasted message to Kafka")

	return util.HandleSuccess(c, "Message saved successfully", nil)
}
