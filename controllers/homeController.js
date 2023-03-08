const  getIndex = (req, res) => {
    res.render("index.ejs");
}
const getProfile = async (req,res)=>{    
      res.render("profile.ejs", {user: req.user });
}


  module.exports={
    getIndex,
    getProfile,
  }