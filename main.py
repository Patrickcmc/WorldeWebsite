from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_guess', methods=['POST'])
def check_guess():
    data = request.get_json()
    guess = data['guess']
    word = "cetie"
    word = word.upper()
    result = {
        'correct_positions': [], 
        'in_word': [],              
        'message': ''
    }
    for i in range(len(guess)): 
        if guess[i] == word[i]: 
            result["correct_positions"].append(i)
            word = list(word)
            word[i] = "_"
            "".join(word)

    for i in range(len(guess)):      
        if guess[i] in word: 
            amount = word.count(guess[i])
            sliced = guess[:i]
            if sliced.count(guess[i]) < amount:
                result['in_word'].append(i)
        if len(result['correct_positions']) == len(word):
            result["message"] = "Correct"
    print(result)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)