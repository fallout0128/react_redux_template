import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import { operations } from '../redux'
import { Main } from '../components'

function mapStateToProps(state) {
  return {
    loading: state.data.loading,
    data: state.data.data
  }
}

function mapDispatchToProps(dispatch) {
  return {
    fetchData: () => dispatch(operations.fetchData())
  }
}

export default reduxForm({ form: 'testForm'})(
  connect(mapStateToProps, mapDispatchToProps)(Main)
)
