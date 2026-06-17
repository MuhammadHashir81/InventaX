import { User } from "../models/user.auth.model.js"

export const subscriptionCheck = async (req,res,next)=>{
    try {
        const user = await User.findById(req.userId)

        if(!user){
            return res.status(400).json({message:'user not found'})
        }

       const sub = user.subscription
       const now = new Date()

    //    active pro plan
       
       if(sub.plan === 'pro' && sub.status === 'active'){
        return next()   
       }
    //    free trial - until the trial ends 

       if (sub.plan === 'free_trial' && new Date(sub.trialEndDate) > now ) { 
        return next()
       }

    //  user cancelled the plan but still has access    

       if (
      sub.plan === 'pro' &&
      sub.cancelAtPeriodEnd === true &&
      sub.currentPeriodEnd &&
      new Date(sub.currentPeriodEnd) > now
    ) {
      return next()
    }

     return res.status(403).json({
      error: 'Subscription required',
      code: 'NO_ACCESS',        // frontend uses this to redirect to /pricing
      plan: sub.plan,
      status: sub.status,
    })

        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:error.message})
        
    }
}