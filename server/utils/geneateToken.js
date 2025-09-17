// import jwt from 'jsonwebtoken';

// export const generateToken = (res,user,message) => {
//         const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE,
//     });
//     return res.status(200).cookie(
//         "token", 
//         token, 
//         {
//         HTMLOnly:true ,
//         sameSite:'strict', 
//         maxAge:720*60*60*1000
//         }
//     ).json({
//         success:true, 
//         message, token,
//         user
//     });
// }




import jwt from 'jsonwebtoken';

export const generateToken = (res, user, message) => {
  // Include user role in JWT token for role-based access control
  const token = jwt.sign({ 
    userId: user._id,
    role: user.role,
    email: user.email
  }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).json({
    success: true,
    message,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
  });
};
// export const generateToken = (res, user, message) => {
//   const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
//   res.cookie('token', token, {   httpOnly: true,   sameSite: 'strict',   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days });    return res.status(200).json({   success: true,   message,   token,   user: {     id: user._id,     name: user.name,     email: user.email,   }, }); };
// export const generateToken = (res, user, message) => {       const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {         expiresIn: process.env.JWT_EXPIRE,     });     return res.status(200).cookie        ("token",          token,          {         HTMLOnly:true ,         sameSite:'strict',          maxAge:720*60*60*1000          }     ).json({         success:true,          message, token,         user     }); }
