
const now = new Date()

const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1 )


const created = {}

const sessionParams = {
    name:'hashir'
}


created.lt = 3
created.gt = 4

sessionParams.created = created

console.log(sessionParams)
