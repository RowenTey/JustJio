package database

import (
	"log"

	"sc2006-JustJio/config"
	"sc2006-JustJio/model"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// DB is a global variable that holds the connection to the database
var DB *gorm.DB

func ConnectDB() {
	// define error here to prevent overshadowing the global DB
	var err error

	dsn := config.Config("DSN")
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		TranslateError: true,
		// SkipDefaultTransaction: true,
	})
	if err != nil {
		log.Println("Failed to connect to database")
		log.Fatal(err)
	}
	log.Println("Connection opened to database")

	err = DB.AutoMigrate(
		&model.User{},
		&model.Room{},
		&model.RoomInvite{},
		&model.Bill{},
		&model.Transaction{},
		&model.Message{},
	)
	if err != nil {
		log.Println("Migration failed: ", err.Error())
	}
	log.Println("Database migrated")
}

func Paginate(page, pageSize int) func(db *gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		if page <= 0 {
			page = 1
		}

		switch {
		case pageSize > 100:
			pageSize = 100
		case pageSize <= 0:
			pageSize = 10
		}

		offset := (page - 1) * pageSize
		return db.Offset(offset).Limit(pageSize)
	}
}
