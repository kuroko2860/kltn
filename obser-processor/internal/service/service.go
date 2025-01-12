package service

import (
	"github.com/qiniu/qmgo"

	"github.com/neo4j/neo4j-go-driver/v5/neo4j"
)

type Service struct {
	*qmgo.Database
	driver neo4j.DriverWithContext
}

var hopCollection *qmgo.Collection
var pathCollection *qmgo.Collection
var operationCollection *qmgo.Collection
var hopEventCollection *qmgo.Collection
var pathEventCollection *qmgo.Collection
var spanCollection *qmgo.Collection

func NewService(db *qmgo.Database, driver neo4j.DriverWithContext) *Service {
	s := &Service{db, driver}

	hopCollection = s.Collection("hop")
	pathCollection = s.Collection("path")
	operationCollection = s.Collection("operation")
	hopEventCollection = s.Collection("hop_event")
	pathEventCollection = s.Collection("path_event")
	timeCollection = s.Collection("time")
	spanCollection = s.Collection("span")
	return s
}