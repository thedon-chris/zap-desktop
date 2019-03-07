import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage, injectIntl } from 'react-intl'
import { Box } from 'rebass'
import { Bar, Form, Header, LndConnectionStringInput } from 'components/UI'
import ConnectionDetailsTabs from './ConnectionDetailsTabs'
import messages from './messages'

class ConnectionDetailsString extends React.Component {
  static propTypes = {
    wizardApi: PropTypes.object,
    wizardState: PropTypes.object,
    connectionString: PropTypes.string,
    startLndHostError: PropTypes.string,
    startLndCertError: PropTypes.string,
    startLndMacaroonError: PropTypes.string,
    lndConnect: PropTypes.string,

    setLndconnect: PropTypes.func.isRequired,
    setConnectionString: PropTypes.func.isRequired,
    clearStartLndError: PropTypes.func.isRequired
  }

  static defaultProps = {
    wizardApi: {},
    wizardState: {}
  }

  componentDidMount() {
    const {
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      clearStartLndError,
      setLndconnect,
      lndConnect
    } = this.props

    // If we have an lndConnect link, populate the form annd submit immediately.
    if (lndConnect) {
      this.formApi.setValue('connectionString', lndConnect)
      this.formApi.setTouched('connectionString', true)
      this.formApi.submitForm()
      setLndconnect(null)
      return
    }

    // If we have an error, set the field as touched so that it gets highlighted.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      this.formApi.setTouched('connectionString', true)
    }

    // PAss any connection errors onto the form field.
    if (startLndHostError) {
      this.formApi.setError('connectionString', startLndHostError)
    }
    if (startLndCertError) {
      this.formApi.setError('connectionString', startLndCertError)
    }
    if (startLndMacaroonError) {
      this.formApi.setError('connectionString', startLndMacaroonError)
    }

    // Clear connection erros now that we have used them.
    if (startLndHostError || startLndCertError || startLndMacaroonError) {
      clearStartLndError()
    }
  }

  componentDidUpdate(prevProps) {
    const { lndConnect, setLndconnect } = this.props

    // If we have an lndConnect link, populate the form annd submit immediately.
    if (lndConnect && lndConnect !== prevProps.lndConnect) {
      this.formApi.setValue('connectionString', lndConnect)
      this.formApi.setTouched('connectionString', true)
      this.formApi.submitForm()
      setLndconnect(null)
      return
    }
  }

  setFormApi = formApi => {
    this.formApi = formApi
  }

  handleSubmit = values => {
    const { setConnectionString } = this.props
    setConnectionString(values.connectionString)
  }

  render() {
    const {
      wizardApi,
      wizardState,
      connectionString,
      startLndHostError,
      startLndCertError,
      startLndMacaroonError,
      lndConnect,
      setLndconnect,
      setConnectionString,
      clearStartLndError,
      ...rest
    } = this.props
    const { getApi, onChange, onSubmit, onSubmitFailure } = wizardApi
    const { currentItem } = wizardState
    return (
      <Form
        {...rest}
        getApi={formApi => {
          this.setFormApi(formApi)
          if (getApi) {
            getApi(formApi)
          }
        }}
        onChange={onChange && (formState => onChange(formState, currentItem))}
        onSubmit={values => {
          this.handleSubmit(values)
          if (onSubmit) {
            onSubmit(values)
          }
        }}
        onSubmitFailure={onSubmitFailure}
      >
        {({ formState }) => {
          const shouldValidateInline =
            formState.submits > 0 ||
            connectionString ||
            startLndHostError ||
            startLndCertError ||
            startLndMacaroonError
          return (
            <>
              <Header
                title={<FormattedMessage {...messages.connection_details_custom_title} />}
                subtitle={<FormattedMessage {...messages.connection_details_custom_description} />}
                align="left"
              />

              <Bar mt={4} mb={1} />

              <ConnectionDetailsTabs mb={4} />

              <LndConnectionStringInput
                autoFocus
                field="connectionString"
                description={
                  <>
                    <Box mb={2}>
                      <FormattedMessage {...messages.connection_uri_lndconnect_description} />
                    </Box>
                    <Box mb={2}>- or -</Box>
                    <Box>
                      <FormattedMessage {...messages.connection_uri_btcpay_description} />
                    </Box>
                  </>
                }
                initialValue={connectionString}
                validateOnBlur={shouldValidateInline}
                validateOnChange={shouldValidateInline}
                required
                rows="12"
              />
            </>
          )
        }}
      </Form>
    )
  }
}

export default injectIntl(ConnectionDetailsString)