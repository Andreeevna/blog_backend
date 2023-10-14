import { body } from 'express-validator'

export const loginValidator = [
	body('email', 'Неверный формат почты').isEmail(),
	body('passwordHash', 'Пароль должен быть минимум 5 символов').isLength({
		min: 5,
	}),
]
