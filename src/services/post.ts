import { TransactionBaseService } from "@medusajs/medusa"

class PostService extends TransactionBaseService {
  getMessage() {
    return `Welcome to My Store!`
  }
}

export default PostService