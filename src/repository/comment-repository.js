import CrudRepository from './crud-repository.js'
import Comment from "../models/comment.js"

class commentRepository extends  CrudRepository {
    constructor() 
    { super(Comment) }
}
export default commentRepository