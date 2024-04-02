router.post("/ResetPassword/:token", userValidator.checkPass(),async function (req, res, next) {
    const resultvalidate = validationResult(req);
    console.log(resultvalidate);
    if (resultvalidate.errors.length > 0) {
      ResHelper.RenderRes(res, false, resultvalidate.errors);
      return;
    }
    var user = await userModel.findOne({
      resetPasswordToken: req.params.token
    })
    if (user) {
      if (user.resetPasswordExp > Date.now()) {
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExp = undefined;
        await user.save();
        ResHelper.RenderRes(res, true, "Reset thanh cong");
      } else {
        ResHelper.RenderRes(res, false, "URL het han");
      }
    } else {
      ResHelper.RenderRes(res, false, "URL khong hop le");
    }
  
  });
  
router.post('/ChangePassword', checkLogin, userValidator.checkPass() , async function (req, res, next) {
    const resultvalidate = validationResult(req);
    console.log(resultvalidate);
    if (resultvalidate.errors.length > 0) {
      ResHelper.RenderRes(res, false, resultvalidate.errors);
      return;
    }
    if (req.cookies.token) {
      const userinfo = req.user;
      let user = await userModel.findById(userinfo._id);
      if(user)
      {
        const bcrypt = require('bcrypt');
          const match = await bcrypt.compare(req.body.password, user.password);
        if(match)
        {
          ResHelper.RenderRes(res, false, "Vui long dang nhap khac hien tai");
        }
        else
        {
          user.password = req.body.password
          await user.save();
          ResHelper.RenderRes(res, true, "Doi password thanh cong");
         
        }
      }
    }else {
      ResHelper.RenderRes(res, false, "URL khong hop le");
    }
  });