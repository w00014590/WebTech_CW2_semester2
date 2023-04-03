const express = require('express')
const app = express()
const fs =require('fs')


app.set('view engine', 'pug')

app.use('/static', express.static('public'))

app.use(express.urlencoded({ extended:false }))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/info', (req, res)=>{
  res.render('info')
})

app.post('/info',(req,res)=>{
  const name = req.body.name
  const age = req.body.age

  if (name.trim() === '' && age.trim()=== ''){
    res.render('info', { error: true })
  } else {
    fs.readFile('./data/workers.json',(err,data)=>{
      if (err) throw err
    
      const workers = JSON.parse(data) 
      
      workers.push({
        id:id(),
        name:name,
        age:age
      })


      fs.writeFile('./data/workers.json', JSON.stringify(workers), err=>{
        if(err) throw err
        
        res.render('info', { success:true })
      })
    })
  }
})

  

app.get('/workers',(req,res)=>{
  fs.readFile('./data/workers.json',(err,data)=>{
    if (err) throw err
    const workers = JSON.parse(data) 
    res.render('workers', { workers: workers })
  })    
})



app.get('/:id/delete', (req, res) =>{
  const id = req.params.id

  fs.readFile('./data/workers.json', (err, data)=>{
    if(err) throw err

    const  workers = JSON.parse(data)
    const filteredworkers = workers.filter(worker=> worker.id != id)
    fs.writeFile('./data/workers.json', JSON.stringify(filteredworkers), (err)=>{
      if(err) throw err

      res.render('workers', {workers: filteredworkers, deleted:true})
    })
  })
})
//app.listeners()

app.listen(3030, err =>{
  if(err)console.log(err)
  console.log('Server is running on port 3030')
})

function id (){
  return'_'+Math.random().toString(36).substr(2,9)
}

