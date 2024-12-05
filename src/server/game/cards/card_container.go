package cards

type CardContainer struct {
	Owner  string
	Cards  map[int]*Card
	Public bool
}
