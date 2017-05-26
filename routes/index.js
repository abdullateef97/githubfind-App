'use strict'
const express = require('express');
let router = express.Router();
const request = require('request');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/repos',function (req,res,next) {
    res.render('repos')
})
router.get('/issues',function(req,res,next){
    res.render('issues')
})
router.get('/users',(req,res,next)=>{
    res.render('users')
})
function genurlpart(urlobject){
    let urlgenerated = '';
    for(let key in urlobject){
        if(key.substring(0,4) === 'sign'){
            let i = urlobject[key].indexOf('+');
            let sign = urlobject[key].substring(0,i);
            let aftersign = urlobject[key].substring(i+1,urlobject[key].length+1);
            if(aftersign){
                urlgenerated+='+'+key.substring(4,key.length+1)+':'+sign+aftersign;
            }

        }
        else{
            if(urlobject[key]){
                urlgenerated += '+'+key+':'+urlobject[key]
            }
        }
    }
   return urlgenerated;
}
router.post('/repos',(req,res,next)=>{
    let datecreated =req.body.datecreated;
    let datepushed = req.body.datepushed;
    let csign = req.body.csign
    let psign = req.body.psign;
    let sign = req.body.sign
    let forks = req.body.forks;
    let name = req.body.name
    let topic = req.body.topic;
    //sign in front of a name indicates d value has a sign (<,<=, ...)
    let urlpart = {name:name,signforks:sign+'+'+forks,signcreated:csign+'+'+datecreated,
                               signpushed:psign+'+'+datepushed}
    //res.send(genurlpart(urlpart))

  let url = 'https://api.github.com/search/repositories?q='
    if(topic){
        let ttopic = '+'+topic;
        url += ttopic
    }
    url+= genurlpart(urlpart)

    /*  if(name){
        let nname = '+name:'+name
        url += nname
    }
      if(forks){
        let fforks = '+forks:'+sign+forks;
        url+= fforks;
    }
    if(datecreated){
        let created = '+created:'+csign+datecreated
        url+=created;
    }
    if(datepushed){
        let pushed = '+pushed:'+psign+datepushed
        url+=pushed;
    }
/!*   let urlgen = genurlpart(urlpart)
    url+= urlgen;*!/*/
    let extra = '&sort=stars&order=desc'
    url+=extra;
    console.log(url)
    let options={
        url: url,
        headers : {'user-agent':'node.js'}
    }
    request.get(options,(error,response,body)=>{
        if(error){
            res.send(error)
        }
        else{
            let items = JSON.parse(body).items
           // res.send(items)
            res.render('repos',{items : items})
        }
    })
})
router.post('/issues',(req,res,next)=>{
    let issue = req.body.issue;
    let user = req.body.user;
    let issues = req.body.issues;
    let involves =req.body.involves;
    let state = req.body.state;
    let language = req.body.language;
    let csign = req.body.csign;
    let datecreated = req.body.datecreated;
    let project = req.body.project;
    let label = req.body.label;
   let urlpart = {user:user,issues:issues,involves:involves,state:state,language:language,
       signcreated:csign+'+'+datecreated,project:project,label:label}
   /* let urlgen = genurlpart(urlpart)*/
    let url = 'https://api.github.com/search/issues?q='
    if(issue){
        let iissue = '+'+issue;
        url+= iissue;
    }
    url+= genurlpart(urlpart)
  /*  if(involves){
        let iinvolves = '+involves:'+involves;
        url+= iinvolves
    }
    if(state){
        let sstate = '+state:'+state
        url+= sstate
    }
    if(issues){
        let iisues = '+issues:'+issues
        url+= iisues
    }
    if(project){
        let pproject = '+project:'+project
        url+= pproject
    }
    if(label){
        let llabel = '+label:'+label
        url+= llabel
    }
    if(language){
        let llanguage = '+language:'+language
        url+= llanguage
    }
    if(datecreated){
        let created = '+created:'+csign+datecreated;
        url+= created
    }
  // url+= urlgen;*/
    let extra = '&sort=created&order=desc'
    url+=extra;
    console.log(url)
 //  res.send(url)
    let options={
        url: url,
        headers : {'user-agent':'node.js'}
    }
    request.get(options,(error,response,body)=>{
        if(error){
            res.send(error)
        }
        else{
            let items = JSON.parse(body).items
           // res.send(items)
            res.render('issues',{items : items})
        }
    })

})
router.post('/users',(req,res,next)=>{
    let name = req.body.name
    let user = req.body.user
    let sign = req.body.sign
    let repos = req.body.repos
    let location = req.body.location
    let language = req.body.language
    let fsign = req.body.fsign
    let followers = req.body.followers
    let urlpart = {user:user,signrepos:sign+'+'+repos,location:location
                         ,language:language,signfollowers: fsign+'+'+followers}

    let url = 'https://api.github.com/search/users?q='
    if (name){
        let nname = '+'+name
        url+= nname
    }
    url+= genurlpart(urlpart);
   /* if(user){
        let uuser = '+user:'+user
        url+= uuser
    }
    if(repos){
        let rrepos = '+repos:'+sign+repos
        url += rrepos
    }
    if(location){
        let llocation = '+location:'+location
        url+= llocation
    }
    if(language){
        let llanguage = '+language:'+language
        url+= llanguage
    }
    if(followers){
        let ffollowers = '+followers:'+fsign+followers
        url += ffollowers
    }*/
 /* let urlgen = genurlpart(urlpart)
    url+= urlgen*/
    let extra = '&sort:scores&order:desc'
    url+= extra
    console.log(url)
    let options={
        url: url,
        headers : {'user-agent':'node.js'}
    }
    request.get(options,(error,response,body)=>{
        if(error){
            res.send(error)
        }
        else{
            let items = JSON.parse(body).items
           // res.send(items)
            res.render('users',{items : items})
        }
    })

})
router.get('/users/:name/repo',(req,res,next)=>{
    let name = req.params.name;

    let url = 'api.github.com/users/'+name+'/repos';
    let options = {
        url : url,
        headers : {'user-agent':'node.js'}
    }
    request.get(options,(error,response,body)=>{
        if(error){
            res.send(error)
        }
        else{
            let items = JSON.parse(body)
            //res.send(items)
            //render on repos page
            res.render('repos',{items : items})
        }
    })
})
router.get('/repos/:login/:name/contributors',(req,res,next)=>{
    let login = req.params.login;let name = req.params.name;
    let url = 'https://api.github.com/repos/'+login+'/'+name+'/contributors';
    console.log('contrributors'+url)
    let options = {
        url : url,
        headers : {'user-agent':'node.js'}
    }
    request.get(options,(error,response,body)=>{
        if(error){
            res.send(error)
        }
        else{
            let items = JSON.parse(body)
            //res.send(items)
            //render on users page
            res.render('users',{items : items})
        }
    })
})


module.exports = router;
