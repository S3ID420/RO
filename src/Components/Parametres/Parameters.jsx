import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import styles from "/src/Components/Parametres/Parametres.module.css";


ChartJS.register(ArcElement, Tooltip, Legend);

function TaskPlanning() {
  const [nbretaches, setNbretaches] = useState(1);
  const [forms, setForms] = useState([]);
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [formdata, setFormdata] = useState({
    critere: "Priorite",
    tasks: [],
    priorités: [1],
    complexités: [1],
    min_time: "",
    total_time: "",
  });
  const [schedule, setSchedule] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

 
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}h`;
          }
        }
      }
    }
  };

  const handleNbreChange = (event) => {
    setNbretaches(event.target.value);
  };

  const handleClick = () => {
    const newForms = [];
    for (let i = 0; i < nbretaches; i++) {
      newForms.push(i + 1);
    }
    setForms(newForms);
  };

  const handletimeTotal = (event) => {
    setFormdata((f) => ({
      ...f,
      total_time: event.target.value,
    }));
  };

  const handletimeminimal = (event) => {
    setFormdata((f) => ({
      ...f,
      min_time: event.target.value,
    }));
  };

  const handlenomtask = (index, value) => {
    setFormdata((f) => {
      const updatedTasks = [...f.tasks];
      updatedTasks[index] = value;
      return { ...f, tasks: updatedTasks };
    });
  };

  const handlePrioritéChange = (index, value) => {
    setFormdata((f) => {
      const updatedPriorités = [...f.priorités];
      updatedPriorités[index] = value;
      return { ...f, priorités: updatedPriorités };
    });
  };

  const handleComplexité = (index, value) => {
    setFormdata((f) => {
      const updatedComplexités = [...f.complexités];
      updatedComplexités[index] = value;
      return { ...f, complexités: updatedComplexités };
    });
  };

  const handleselect = (event) => {
    setFormdata((f) => ({
      ...f,
      critere: event.target.value,
    }));
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleSubmit = () => {
    const API_URL = "http://127.0.0.1:5000/solve";

    
    console.log('Submitting formdata:', formdata);

    axios
      .post(API_URL, formdata)
      .then((response) => {
        if (response.data.schedule) {
          
          console.log('Received schedule:', response.data.schedule);
          
          setSchedule(response.data.schedule);
          const newChartData = {
            labels: response.data.schedule.map((item) => item.subject),
            datasets: [
              {
                label: 'Temps par tâche',
                data: response.data.schedule.map((item) => parseFloat(item.time)),
                backgroundColor: [
                  'rgba(0, 0, 0, 0.8)',
                  'rgba(117, 200, 255, 0.8)',
                  'rgba(168, 127, 22, 0.14)',
                  'rgba(75, 192, 192, 0.8)',
                  'rgba(153, 102, 255, 0.8)',
                  'rgba(255, 159, 64, 0.8)',
                  'rgba(255, 99, 132, 0.8)',
                  'rgba(54, 162, 235, 0.8)',
                  'rgba(255, 206, 86, 0.8)',
                  'rgba(75, 192, 192, 0.8)',
                ],
                borderColor: [
                  'rgb(0, 0, 0)',
                  'rgb(0, 0, 0)',
                  'rgb(0, 0, 0)',
                  'rgb(0, 0, 0)',
                  'rgb(0, 0, 0)',
                  'rgb(0, 0, 0)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
              },
            ],
          };
          
         
          console.log('Setting chart data:', newChartData);
          
          setChartData(newChartData);
          setModalMessage("");
        } else {
          setModalMessage("Aucune solution trouvée pour ces paramètres");
          setSchedule([]);
          setChartData(null);
        }
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
        setModalMessage(
          "Une erreur s'est produite lors du traitement de votre demande"
        );
        setIsModalOpen(true);
      });
  };

  return (
    <div className="container">
      <Form>
        <FormGroup>
          <Label for="OPTION">Choisir le critère de planification:</Label>
          <Input
            id="critère"
            name="critère"
            placeholder="------"
            type="select"
            onChange={handleselect}
          >
            <option value="Priorite">Priorité</option>
            <option value="Complexite">Complexité</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="nbre_taches">Nombre de tâches à planifier :</Label>
          <Input
            id="nbre_taches"
            name="nbre_taches"
            placeholder="Ex: 3"
            type="select"
            onChange={handleNbreChange}
          >
            {array.map((nbre, index) => (
              <option key={index} value={nbre}>
                {nbre}
              </option>
            ))}
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="temps_total">Temps total estimé (en h):</Label>
          <Input
            id="temps_total"
            name="temps_total"
            placeholder="Ex: 90"
            type="number"
            required
            onChange={handletimeTotal}
          />
        </FormGroup>

        <FormGroup>
          <Label for="temps_minimal">Temps minimal de la tâche :</Label>
          <Input
            id="temps_minimal"
            name="temps_minimal"
            type="number"
            placeholder="Ex: 5"
            onChange={handletimeminimal}
          />
        </FormGroup>

        <div className={styles.wrapper}>
          <Button onClick={handleClick} color="primary">
            Caractériser vos tâches !
          </Button>
        </div>
      </Form>

      {forms.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Configuration des tâches</h3>
          <Form>
            {forms.map((type, index) => (
              <React.Fragment key={index}>
                <h5>Tâche {type}</h5>
                <Row className="row-cols-lg g-3" id={styles.row}>
                  <Col className={styles.col}>
                    <FormGroup>
                      <Label for={`nom_tache_${index}`}>Nom de la tâche :</Label>
                      <Input
                        id={`nom_tache_${index}`}
                        name={`nom_tache_${index}`}
                        placeholder="Ex: Étudier la biologie"
                        type="text"
                        onChange={(e) => handlenomtask(index, e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`priorité-${type}`}>
                        Priorité de la tâche :
                      </Label>
                      <Input
                        id={`priorité-${type}`}
                        name={`priorité-${type}`}
                        placeholder="1"
                        type="select"
                        onChange={(e) =>
                          handlePrioritéChange(index, e.target.value)
                        }
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for={`complexité-${type}`}>
                        Complexité de la tâche :
                      </Label>
                      <Input
                        id={`complexité-${type}`}
                        name={`complexité-${type}`}
                        placeholder="1"
                        type="select"
                        onChange={(e) =>
                          handleComplexité(index, e.target.value)
                        }
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <hr />
              </React.Fragment>
            ))}
            <div className={styles.wrapper}>
              <Button onClick={handleSubmit} color="success">
                Optimiser la planification
              </Button>
            </div>
          </Form>
        </div>
      )}

      <Modal isOpen={isModalOpen} toggle={toggleModal} size="lg">
        <ModalHeader toggle={toggleModal}>
          Résultat de la planification
        </ModalHeader>
        <ModalBody>
          {modalMessage ? (
            <div className="text-center p-3">{modalMessage}</div>
          ) : (
            <div className="row">
              <div className="col-md-6">
                {schedule.map((item, index) => (
                  <div key={index} className="mb-3 p-3 border rounded">
                    <div className="font-weight-bold mb-2">
                      Tâche: {item.subject}
                    </div>
                    <div>Durée: {item.time}h</div>
                  </div>
                ))}
              </div>
              <div className="col-md-6">
                {chartData && (
                  <div style={{ height: '500px', width: '100%', position: 'relative' }}>
                    
                    <Doughnut 
                      data={chartData} 
                      options={chartOptions}
                      height={400}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}

export default TaskPlanning;