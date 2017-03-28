const APIError = require('../rest').APIError;
const Comment = require('../model/comment')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
module.exports = {
    'POST /api/comment/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        if(!t.commentContent || !t.commentContent.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentContent'})) 
            return
        }
        if(!t.commentTargetId || !t.commentTargetId.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentTargetId'})) 
            return
        }
        if(isNaN(t.commentTargetId)){
            ctx.rest(Result.create(9,{msg:'wrong commentTargetId format'})) 
            return
        }
        
        let com =new Comment(t.commentTargetId,id,t.commentContent)
        com.comment_time = new Date().getTime()
        if(t.commentTargetUserId){
            com.comment_target_userId = t.commentTargetUserId
            com.comment_type = t.commentType
            com.comment_scope = t.commentScope
            let res = await Comment.insertSubComment(com)
            ctx.rest(res)
        }
        else{
            let res = await Comment.insertMainComment(com)
            ctx.rest(res)
        }
        
    },

    'POST /api/comment': async (ctx, next) => {
        var t = ctx.request.body;
        if(!t.commentContent || !t.commentContent.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentContent'})) 
            return
        }
        if(!t.commentTargetId || !t.commentTargetId.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentTargetId'})) 
            return
        }
        if(isNaN(t.commentTargetId)){
            ctx.rest(Result.create(9,{msg:'wrong commentTargetId format'})) 
            return
        }
        let com =new Comment(t.commentTargetId,0,t.commentContent)
        com.comment_time = new Date().getTime()
        if(t.commentTargetUserId){
            com.comment_target_userId = t.commentTargetUserId
            let type = Check.checkNum(t,'commentType')
            if(type){
                ctx.rest(type)
                return
            }
            com.comment_type = t.commentType
            let scope = Check.checkNum(t,'commentScope')
            if(scope){
                ctx.rest(scope)
                return
            }
            com.comment_scope = t.commentScope
            let res = await Comment.insertSubComment(com)
            ctx.rest(res)
        }
        else{
            let res = await Comment.insertMainComment(com)
            ctx.rest(res)
        }
    },

    'GET /api/comment/:commentId': async (ctx, next) => {
       
    },

}

