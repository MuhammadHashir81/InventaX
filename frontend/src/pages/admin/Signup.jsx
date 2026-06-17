import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from 'react-redux'
import { clearError,signUpUser } from "../../../features/auth/authSlice";
import { useEffect } from "react";
import { toast, Toaster } from 'react-hot-toast'
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";


const Signup = () => {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()


  const dispatch = useDispatch()
  const { loading, error, success } = useSelector((state) => state.auth)
  console.log(loading, error, success)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = (data) => {
    dispatch(signUpUser(data))

  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }
  
    useEffect(() => {
        if (success) {

            toast.success(success)

            dispatch(clearError())
            
            setTimeout(() => {
                navigate('/login')

            }, 3000);

        }
        if (error) {
            toast.error(error)
            dispatch(clearError())

        }
    }, [error, success])




  return (
    <div className="min-h-screen bg-[#f6f6f6] flex items-center justify-center font-secondary">
      <div className="w-[420px] bg-white shadow-md rounded-sm border border-gray-200">
        <Toaster />

        {/* Header */}
        <div className="bg-blue-500 px-6 py-4 rounded-t-sm flex items-center justify-between">
          <h2 className="text-white text-xl font-medium">
            Create your account
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">

          {/* Username */}
          <label className="block text-sm mb-1 text-gray-700">
            Username:
          </label>
          <div>

          <div className="px-2.5 py-0.5   rounded-sm  flex items-center bg-[#f9f9f9] ">
            <FaUserAlt className="text-gray-400" />
            <input
              placeholder="enter name "
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 rounded-sm bg-[#f9f9f9] focus:outline-none "
            />
          </div>
                      {errors.username && (
              <p className="text-red-500 text-xs mt-1">
                {errors.username.message}
              </p>
            )}


          </div>

          {/* email  */}
          <label className="block text-sm mb-1 text-gray-700">
            Email:
          </label>
          <div>
          <div className="px-2.5 py-0.5   rounded-sm  flex items-center bg-[#f9f9f9] ">

            <MdOutlineAlternateEmail className="text-gray-400" />
            <input
              type="email"
              placeholder="enter email"
              {...register("email", { required: "email is required" })}
              className="w-full px-3 py-2 outline-none"
            />
          </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Password */}
          <label className="block text-sm mb-1 text-gray-800">
            Password:
          </label>
          <div>


            <div className="px-2.5 py-0.5   rounded-sm  flex items-center bg-[#f9f9f9] " >
              <RiLockPasswordFill className="text-gray-400" />
              <input
                placeholder="enter password"
                type={`${isVisible ? 'password' : 'text'}`}
                {...register("password", { required: "Password is required" })}
                className="w-full px-3 py-2 outline-none"
              />

              {
                isVisible ? <FaEyeSlash onClick={toggleVisibility} /> : <FaEye onClick={toggleVisibility} />
              }
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}

          </div>


          {/* Button */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 cursor-pointer text-white px-6 py-2 rounded-sm text-sm font-medium transition"
            >
              sign up
            </button>

            <NavLink to='/login' className="">don't have an account? <p className="inline text-blue-600 underline">login</p></NavLink>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Signup;

