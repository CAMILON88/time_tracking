class TimerDashBoard extends React.Component { // Outermost Component
  constructor() {
    super()
    this.state = {
      timers: [
        {
         title: 'Practice squat',
         project: 'Gym Chores',
         id: uuid.v4(),
         elapsed: 5456099,
         runningSince: Date.now(),
       },
       {
         title: 'Bake squash',
         project: 'Kitchen Chores',
         id: uuid.v4(),
         elapsed: 1273998,
         runningSince: null,
       }
     ]
    }
    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this)
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this)
    this.handleTrashClick = this.handleTrashClick.bind(this)
    this.handleStartClick = this.handleStartClick.bind(this)
    this.handleStopClick = this.handleStopClick.bind(this)
    // this.handleUpdateTimer = this.handleUpdateTimer.bind(this)
  }
  handleCreateFormSubmit(timer) {
    this.createTimer(timer)
  }
  handleEditFormSubmit(attrs) {
    this.updateTimer(attrs)
  }
  handleTrashClick(timerId) {
    this.deleteTimer(timerId)
  }
  handleStartClick(timerId) {
    this.startTimer(timerId)
  }
  handleStopClick(timerId) {
    this.stopTimer(timerId)
  }
  stopTimer(timerId) {
    const timers = this.state.timers.map((timer) => {
      if (timer.id === timerId) {
        return Object.assign({}, timer, {
          elapsed: timer.elapsed + (Date.now() - timer.runningSince) ,
          runningSince: null
        })
      } else {
        return timer
      }
    })
    this.setState({timers})
  }
  startTimer(timerId) {
    const timers = this.state.timers.map((timer) => {
      if (timer.id === timerId) {
        return Object.assign({}, timer, {
          runningSince: Date.now()
        })
      } else {
        return timer
      }
    })
    this.setState({timers})
  }
  // handleUpdateTimer(timerId) {
  //   console.log('timerId', timerId)
  //   this.updateTimerSeconds(timerId)
  // }
  // startTimer(timerId) {
  //   const timers = this.state.timers.map((timer) => {
  //     if (timer.id === timerId) {
  //       return Object.assign({}, timer, {
  //         runningSince: Date.now()
  //       })
  //     } else {
  //       return timer
  //     }
  //   })
  //   this.setState({timers})
  // }
  // updateTimerSeconds(timerId) {
  //   console.log('inside updateTimerSeconds')
  //   const timers = this.state.timers.map((timer) => {
  //     if (timer.id === timerId) {
  //       return Object.assign({}, timer, {
  //         elapsed: timer.elapsed + 1000
  //       })
  //     } else {
  //       return timer
  //     }
  //   })
  //   this.setState({timers})
  // }
  deleteTimer(timerId) {
    const timers = this.state.timers.filter(timer => timer.id !== timerId)
    this.setState({
      timers: timers
    })
  }
  updateTimer(attrs) {
    const timers = this.state.timers.map((timer) => {
      if (timer.id === attrs.id) {
        return Object.assign({}, timer, {
          title: attrs.title,
          project: attrs.project
        })
      } else {
        return timer
      }
    })
    this.setState({
      timers: timers
    })
  }
  createTimer(timer) {
    const t = helpers.newTimer(timer)
    this.setState({
      timers: this.state.timers.concat(t),
    })
  }
  render() {
    return (
      <div className='ui three column centered grid'>
        <div className='column'>
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
            />
          <ToggleableTimerForm
            isOpen={false}
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    )
  }
}

class EditableTimerList extends React.Component { // List of timers
  render() {
    const timers = this.props.timers.map((timer) => {
      return  (
        <EditableTimer
          {...timer}
          key={timer.id}
          onFormSubmit={this.props.onFormSubmit}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
        />
      )
    })
    return(
      <div id='timers'>
        {timers}
      </div>
    )
  }
}

class EditableTimer extends React.Component { // Container that decided which timer to show
  constructor() {
    super()
    this.state = {
      editFormOpen: false
    }
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleFormCloseClick = this.handleFormCloseClick.bind(this)
  }
  handleEditClick() {
    this.openForm()
  }
  handleFormCloseClick() {
    this.closeForm()
  }
  closeForm() {
    this.setState({editFormOpen: false})
  }
  openForm() {
    this.setState({editFormOpen: true})
  }
  render() {
    if (this.state.editFormOpen) {
      return <TimerForm
        title={this.props.title} project={this.props.project} id={this.props.id}
        onFormClose={this.handleFormCloseClick} onFormSubmit={this.props.onFormSubmit}
      />
    } else {
      return <Timer {...this.props}
              onEditClick={this.handleEditClick}
              onTrashClick={this.props.onTrashClick}
              onStartClick={this.props.onStartClick}
              onStopClick={this.props.onStopClick}
              />
    }
  }
}

class TimerForm extends React.Component { // Form to create Timer
  handleSubmit() {
    this.props.onFormSubmit({
      id: this.props.id,
      title: this.refs.title.value,
      project: this.refs.project.value
    })
    this.props.onFormClose()
  }
  render() {
    const submitText = this.props.id ? 'Update' : 'Create'
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='ui form'>
            <div className='field'>
              <label>Title</label>
              <input ref='title' type='text' defaultValue={this.props.title} />
            </div>
            <div className='field'>
              <label>Project</label>
              <input type='text' ref='project' defaultValue={this.props.project} />
            </div>
            <div className='ui two bottom attached buttons'>
              <button onClick={this.handleSubmit.bind(this)} className='ui basic blue button'>
                {submitText}
              </button>
              <button onClick={this.props.onFormClose} className='ui basic red button'>
                Cancel
              </button>
            </div>
          </div>
        </div>
    </div>
    )
  }
}

class ToggleableTimerForm extends React.Component { // Create new timers
  constructor(props) {
    super(props)
    this.state ={
      isOpen: false
    }
    this.handleFormOpen = this.handleFormOpen.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
    this.handleFormClose = this.handleFormClose.bind(this)
  }
  handleFormSubmit(timer) {
    this.props.onFormSubmit(timer)
    this.setState({isOpen: false})
  }
  handleFormClose(){
    this.setState({isOpen: false})
  }
  handleFormOpen() {
    this.setState({
      isOpen: true
    })
  }
  render() {
    if (this.state.isOpen) {
      return (
        <TimerForm onFormSubmit={this.handleFormSubmit} onFormClose={this.handleFormClose}/>
      )
    } else {
      return (
        <div className='ui basic content center aligned segment'>
          <button onClick={this.handleFormOpen} className='ui basic button icon'>
            <i className='plus icon'></i>
          </button>
        </div>
      )
    }
  }
}

class Timer extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }
  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }
  handleTrashClick() {
    this.props.onTrashClick(this.props.id)
  }
  // handleStartClick() {
  //   this.props.onStartClick(this.props.id)
  //   this.handleUpdateTimer()
  // }
  // handleUpdateTimer() {
  //   const timerStart = setInterval(() => {
  //     this.props.onUpdateTimer(this.props.id)
  //   }, 1000)
  // }
  handleStartClick() {
    this.props.onStartClick(this.props.id)
  }
   handleStopClick() {
    this.props.onStopClick(this.props.id)
  }
  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince)
    return (
      <div className='ui centered card'>
        <div className='content'>
          <div className='header'>
            {this.props.title}
          </div>
          <div className='meta'>
            {this.props.project}
          </div>
          <div className='center aligned description'>
            <h2>
              {elapsedString}
            </h2>
          </div>
          <div className='extra content'>
            <span onClick={this.props.onEditClick} className='right floated edit icon'>
              <i className='edit icon'></i>
            </span>
            <span onClick={this.handleTrashClick.bind(this)}className='right floated trash icon'>
              <i className='trash icon'></i>
            </span>
          </div>
        </div>
        <TimerActionButtons
          timerIsRunning={!!this.props.runningSince}
          onStartClick={this.handleStartClick.bind(this)}
          onStopClick={this.handleStopClick.bind(this)}
        />
        {/*<div onClick={this.handleStartClick.bind(this)} className='ui bottom attached blue basic button'>
          Start
        </div>*/}
      </div>
    );
  }
}

class TimerActionButtons extends React.Component {
  render() {
    if (this.props.timerIsRunning) {
      return (
        <div
          className='ui bottom attached red basic button'
          onClick={this.props.onStopClick}
        >
          Stop
        </div>
      )
    } else {
      return (
        <div
          className='ui bottom attached green basic button'
          onClick={this.props.onStartClick}
        >
          Start
        </div>
      )
    }
  }
}

ReactDOM.render(<TimerDashBoard />, document.getElementById('content'))

