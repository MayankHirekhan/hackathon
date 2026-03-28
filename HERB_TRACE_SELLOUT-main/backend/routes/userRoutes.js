const router = require("express").Router()

const {
 createUser,
 getUsers
} = require("../controllers/userController")

router.post("/create",createUser)

router.get("/all",getUsers)

module.exports = router