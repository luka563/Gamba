const Game = require("../models/Game");
const cloudinary = require("../middleware/cloudinary");
const User = require("../models/User")

exports.getAllGames = async(req, res) => {
        let games
        try {
            games = await Game.find()
        } catch (error) {
           return console.log(error)
        }
        res.render('games',{games:games})
}

exports.addGame = async(req,res)=>{
    let result
    try {        
        result = await cloudinary.uploader.upload("123.png");
    } catch (error) {
        console.log(error)
    }

    let game
    try {
        game = await Game.findOne({name:req.body.name})
    } catch (error) {
        return console.log(error)
    }
    if(game)
        return res.status(400).json({message:"game already exists with taht name"})
    
    const newGame = new Game({
        name:req.body.name,
        picture: result.secure_url,
        cloudinaryId: result.public_id,
        numberOfVotes: 0,
        sumOfVotes: 0
    })    
    try {
        newGame.save()
    } catch (error) {
        return console.log(error)
    }
    res.status(200).json(newGame);
}

exports.getGame = async(req,res)=>{
    let game
    try {
        game = await Game.findOne({name:req.params.name})
    } catch (error) {
        return console.log(error)
    }
    if(!game)
        return res.status(400).json({message:"cant find this game"})
    return res.render(`allGames/${game.name}`,{game:game})
}

exports.playGame = async(req,res)=>{

}
exports.addFavoriteGame = async(req,res)=>{
    if(!req.session.user)
    {
        res.render("index")
    }    
    let user,game
    try {        
         user =await User.findById(req.session.user._id)
         game =await Game.findOne({name:req.params.name})
    } catch (error) {
        return console.log("database problem")
    }
    if(!game || !user)
    {
        console.log("no user or game")
        return res.render("/")
    }     
    user.likedGames.push(game)
    await user.save()
    user = await User.findById(req.session.user._id).populate('likedGames')
    req.session.user = user
    res.render("profile",{user:req.session.user})    
}
exports.removeFromFavoriteGames = async(req,res)=>{
    if(!req.session.user)
    {
        res.render("index")
    } 
    user = await User.findById(req.session.user._id).populate('likedGames')
    found = false
    for(let i=0;i<user.likedGames.length;i++)
    {
        if(user.likedGames[i].name == req.params.name)
        {
            index=i;
            found = true;
            break;
        }
    }
    if(found)
    {
        user.likedGames.splice(index, 1);
        console.log(index)
        user.save()
        req.session.user = user
    }
    res.render("profile",{user:req.session.user})  
}
