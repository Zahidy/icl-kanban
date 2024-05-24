import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import boardApi from '../api/boardApi'
import { Box, Button, Divider, IconButton, TextField, Typography } from '@mui/material'
import StarOutlinedIcon from '@mui/icons-material/StarOutlined'
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EmojiPicker from '../components/layout/common/EmojiPicker'
import { useDispatch, useSelector } from 'react-redux'
import { setBoards } from '../redux/features/boardSlice'

let timer
const timeout = 500

const Board = () => {
  const dispatch = useDispatch()
  const { boardId } = useParams()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sections, setSections] = useState([])
  const [isFavourite, setIsFavourite] = useState(false)
  const [icon, setIcon] = useState('')

  const boards = useSelector((state) => state.board.value)
  
  useEffect(() => {
    const getBoard = async () => {
      try {
        const res = await boardApi.getOne(boardId)
        setTitle(res.title)
        setDescription(res.description)
        setSections(res.sections)
        setIsFavourite(res.favourite)
        setIcon(res.icon)
      } catch (err) {
        alert(err)
      }
    }
    getBoard()
  }, [boardId])

  const onIconChange = async (newIcon) => {
    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], icon: newIcon}
    setIcon(newIcon)
    dispatch(setBoards(temp))
    try {
      await boardApi.update(boardId, { icon: newIcon})
    } catch (err) {
      alert (err)
    }
  }

  const updateTitle = async (e) => {
    clearTimeout(timer)
    const newTitle = e.target.value
    setTitle(newTitle)

    let temp = [...boards]
    const index = temp.findIndex(e => e.id === boardId)
    temp[index] = { ...temp[index], title: newTitle}
    dispatch (setBoards(temp))
    
    timer = setTimeout( async () => {
      try {
        await boardApi.update(boardId, { title: newTitle})
      } catch (err) {
        alert (err)
      }
    }, timeout);
  }

  const updateDescription = async (e) => {
    clearTimeout(timer)
    const newDescription = e.target.value
    setDescription(newDescription)
    timer = setTimeout( async () =>{
      try {
        await boardApi.update(boardId, { description: newDescription})
      } catch (err) {
        alert (err)
      }
    }, timeout);
  }

  const addFavourite = async () => {
    try {
      await boardApi.update(boardId, { favourite: !isFavourite})
      setIsFavourite(!isFavourite)
    } catch (err) {
      alert (err)
    }
  }
  
  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        <IconButton variant='outlined' onClick={addFavourite}>
          {
            isFavourite ? (
              <StarOutlinedIcon color='warning' />
            ) : (
              <StarBorderOutlinedIcon />
            )
          }
        </IconButton>
        <IconButton variant='outlined' color='error'>
          <DeleteOutlinedIcon />
        </IconButton>
      </Box>
      <Box sx={{ padding: '10px 50px' }}>
        <Box>
          {/* emoji picker */}
          <EmojiPicker icon={icon} onChange={onIconChange} />
          <TextField
            onChange={updateTitle}
            value={title}
            placeholder='Untitled'
            variant='outlined'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '2rem', fontWeight: '700' }
            }}
          />
          <TextField
            value={description}
            onChange={updateDescription}
            placeholder='Add a description'
            variant='outlined'
            multiline
            fullWidth
            sx={{
              '& .MuiOutlinedInput-input': { padding: 0 },
              '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
              '& .MuiOutlinedInput-root': { fontSize: '0.8rem' }
            }}
          />
        </Box>
        <Box>
          {/* Kanban board */}
        </Box>
      </Box>
    </>
  )
}

export default Board