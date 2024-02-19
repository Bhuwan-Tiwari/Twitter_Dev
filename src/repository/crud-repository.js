class CrudRepository {
    constructor(model)
    {
        this.model = model;
    }
    async create(data)
    {
        try {
            const result= await this.model.create(data)
            return result
        } catch (error) {
            console.log("somethimg went wrong in crud repo1")
            throw error
        }
    }

    async destroy(id)
    {
        try {
            const result= await this.model.findByIdAndDelete(id)
            return result
        } catch (error) {
            console.log("somethimg went wrong in crud repo")
            throw error
        }
    }
 
    async get(id)
    {
        try {
            const result= await this.model.findById(id)
            return result
        } catch (error) {
            console.log("somethimg went wrong in crud repo2")
            throw error
        }
    }
    async getAll()
    {
        try {
            const result= await this.model.findById({})
            return result
        } catch (error) {
            console.log("somethimg went wrong in crud repo")
            throw error
        }
    }
    async update(id,data)
    {
        try {
            const result= await this.model.findByIdAndUpdate(id,data,{new :true}) //we use new to to return updated document as by default it  returns the old one
            return result
        } catch (error) {
            console.log("somethimg went wrong in crud repo")
            throw error
        }
    }
}
export default  CrudRepository;