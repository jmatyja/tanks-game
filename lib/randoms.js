var Randoms = function(){
    var distribute = function(probs){
        var elementsSum = probs.reduce(function(a, b) {
            return a + b;
        });
        var r = randomInt(0, elementsSum);
        var i = 0,
            acc = 0;
        while ((acc += probs[i]) <= r)
            i++;
        return i;
    }
    var randomInt = function(low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    }

    return {
        distribute: distribute,
        randomInt: randomInt
    }
}();
module.exports = Randoms;