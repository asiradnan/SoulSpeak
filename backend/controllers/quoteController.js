// Mental health and wellness quotes for daily inspiration
const mentalHealthQuotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "Your mental health is a priority, not a luxury.", author: "Unknown" },
    { text: "You are not alone in this journey. Reach out, speak up, and seek help when you need it.", author: "Unknown" },
    { text: "Progress, not perfection. Every step forward counts.", author: "Unknown" },
    { text: "It is okay to not be okay, but it is not okay to stay that way.", author: "Unknown" },
    { text: "Your struggle does not define you. Your strength does.", author: "Unknown" },
    { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
    { text: "Recovery is possible, and you are worthy of it.", author: "Unknown" },
    { text: "Healing doesn't mean the damage never existed. It means the damage no longer controls our lives.", author: "Akshay Dubey" },
    { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
    { text: "Mental health is not about being happy all the time. It's about feeling your best most of the time.", author: "Unknown" },
    { text: "Seeking help is a sign of strength, not weakness.", author: "Unknown" },
    { text: "You are enough. You have always been enough, and you will always be enough.", author: "Unknown" },
    { text: "The fact that you're still trying proves you haven't given up. That's what matters most.", author: "Unknown" },
    { text: "Take care of your mind. It's the only one you get.", author: "Unknown" },
    { text: "Happiness is not the absence of problems, but the ability to deal with them.", author: "Steve Maraboli" },
    { text: "Your voice matters. Your feelings are valid. You deserve to be heard.", author: "Unknown" },
    { text: "Every moment is a fresh beginning. You have the power to change your story.", author: "Unknown" },
    { text: "Self-care is not selfish. It's necessary maintenance.", author: "Unknown" },
    { text: "You are worthy of love, respect, and kindness—especially from yourself.", author: "Unknown" },
    { text: "Anxiety is like a storm: loud, powerful, but it will pass.", author: "Unknown" },
    { text: "Your past does not define your future. Your choices do.", author: "Unknown" },
    { text: "It's okay to take a break. Rest is productive.", author: "Unknown" },
    { text: "You don't need to be perfect to be worthy of love and respect.", author: "Unknown" },
    { text: "One step at a time. One day at a time. You've got this.", author: "Unknown" },
];

export const getRandomQuote = async (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * mentalHealthQuotes.length);
        const quote = mentalHealthQuotes[randomIndex];
        res.status(200).json(quote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
