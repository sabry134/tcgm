package config_loader

// valuesEqual is used to check if two values equl regardless of the type.
func valuesEqual(a, b interface{}) bool {
	switch va := a.(type) {
	case int:
		if vb, ok := b.(int); ok {
			return va == vb
		}
		if vb, ok := b.(float64); ok {
			return float64(va) == vb
		}
	case float64:
		if vb, ok := b.(int); ok {
			return va == float64(vb)
		}
		if vb, ok := b.(float64); ok {
			return va == vb
		}
	case string:
		if vb, ok := b.(string); ok {
			return va == vb
		}
	}

	return false
}

// containsString is used to check if a string contains a value.
func containsString(slice []string, value string) bool {
	for _, v := range slice {
		if v == value {
			return true
		}
	}
	return false
}
