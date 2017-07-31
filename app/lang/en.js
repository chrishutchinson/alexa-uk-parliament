module.exports = {
	launch: data =>
		`Welcome to the UK Parliament Alexa Skill, where you can find out more about the elected officials that represent you. Ask about the MP in your area. For example, ask, "Who is the MP in Islington?"`,

	help: data =>
		`This skill helps you find out more about the UK Members of Parliament that represent you. You can ask about the MP in your area. For example, ask, "Who is the MP in Islington?"`,

	unknownIntent: data =>
		`I'm sorry, I didn't understand what you meant, try, "Who is the MP in Islington?"`,
};
