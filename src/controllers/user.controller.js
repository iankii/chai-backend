import { asyncHandler } from './../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser = asyncHandler(async (req, res) => {
  // STEPS:
  // get user details from frontend
  // validations
  // check if user exist: username and email
  // check for images and avatar
  // upload files to cloudinary, avatar
  // create user object - create entry into DB
  // remove password and refresh token from response
  // check if user created, if yes, return response else return null

  const { fullName, username, email, password } = req.body;
  console.log('email: ', email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === '')
  ) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });

  console.log('existedUser: ', existedUser);
  if (existedUser) {
    throw new ApiError(409, 'User already existed with email or username!!!');
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  console.log('req.files: ', req.files);

  if (!avatarLocalPath) {
    throw new ApiError(400, 'Avatar file is required !!!');
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (avatar) {
    throw new ApiError(400, 'Avatar file is required !!!');
  }

  // create user in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || '',
    password,
    email,
    username: username.toLowerCase(),
  });

  // check if user created
  // inside select, we pass key with '-' sign to remove items we dont want with response
  const createdUser = await User.find(user._id).select(
    '-password -refreshToken'
  );

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while creating User !!!');
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

export { registerUser };
