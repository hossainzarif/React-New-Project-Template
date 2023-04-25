import { Container, Form, Spinner } from 'react-bootstrap'
import { useState } from 'react'
import Papa from 'papaparse'
import Table from 'react-bootstrap/Table'
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

function App() {
  const baseURL =
    'https://7icomwtdi1.execute-api.us-east-2.amazonaws.com/test/predictbreastcancer'

  const [show, setShow] = useState(false)
  const [isloading, setisloading] = useState(false)
  const handleClose = () => setShow(false)
  function handleShow() {
    setisloading(true)
    setTimeout(() => {
      setShow(true)
      setisloading(false)
    }, 2000)
    // setisloading(false)
  }

  const [parsedData, setParsedData] = useState([])
  const [val, setval] = useState(null)
  //State to store table Column name
  const [tableRows, setTableRows] = useState([])
  const [post, setPost] = useState(null)

  //State to store the values
  const [values, setValues] = useState([])
  const [jvalues, setjValues] = useState(null)
  function predictCancer() {
    axios
      .post(
        baseURL,
        {
          val,
        },
        {
          // mode: 'no-cors',
          headers: {
            // 'Access-Control-Allow-Origin': '*',
            // Accept: 'application/json',
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Methods': 'POST,PATCH,OPTIONS',
            // 'Access-Control-Allow-Headers':
            //   'Origin, Content-Type, X-Auth-Token',
          },

          // withCredentials: true,
          // credentials: 'same-origin',
          // crossdomain: true,
        }
      )
      .then((response) => {
        setPost(response.data)
        console.log(response.data)
        alert(response.data)
      })
  }

  const changeHandler = (event) => {
    // Passing file data (event.target.files[0]) to parse using Papa.parse
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        const rowsArray = []
        const valuesArray = []

        // Iterating data to get column name and their values
        results.data.map((d) => {
          rowsArray.push(Object.keys(d))
          valuesArray.push(Object.values(d))
        })

        console.log(valuesArray)
        // Parsed Data Response in array format
        setParsedData(results.data)
        setjValues(JSON.stringify(valuesArray))
        // Filtered Column Names
        setTableRows(rowsArray[0])
        var jsonObj = { data: valuesArray.toString() }
        setval(jsonObj)
        console.log(jsonObj)
        // Filtered Values
        setValues(valuesArray)
      },
    })
  }

  return (
    <div className='App'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Model Prediction</Modal.Title>
        </Modal.Header>
        <Modal.Body>The tumor is "Benign"</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button variant='primary' onClick={handleClose}>
            Ok{' '}
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className='container'>
        <h1>Input your Data for Prediction</h1>
        <Form className='py-2' onSubmit={predictCancer}>
          <Form.Group controlId='formFileLg' className='mb-3'>
            <Form.Label></Form.Label>
            <Form.Control
              type='file'
              size='lg'
              accept='.csv'
              onChange={changeHandler}
            />
          </Form.Group>
        </Form>{' '}
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                {tableRows.map((rows, index) => {
                  return <th key={index}>{rows}</th>
                })}
              </tr>
            </thead>
            <tbody>
              {values.map((value, index) => {
                return (
                  <tr key={index}>
                    {value.map((val, i) => {
                      return <td key={i}>{val}</td>
                    })}
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </div>
        <Button disabled={!val} variant='primary' onClick={handleShow}>
          Predict
        </Button>{' '}
        {isloading ? <Spinner></Spinner> : <div></div>}
      </Container>
    </div>
  )
}

export default App
