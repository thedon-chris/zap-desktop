import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { Flex } from 'rebass'
import { Button, Text } from 'components/UI'
import PlusCircle from 'components/Icon/PlusCircle'
import messages from './messages'

const CreateWalletButton = ({ history, ...rest }) => (
  <Button size="small" variant="secondary" onClick={() => history.push('/onboarding')} {...rest}>
    <Flex alignItem="center">
      <Text color="lightningOrange">
        <PlusCircle width="22px" height="22px" />
      </Text>
      <Text lineHeight="22px" ml={2}>
        <FormattedMessage {...messages.create_wallet_button_text} />
      </Text>
    </Flex>
  </Button>
)
CreateWalletButton.propTypes = {
  history: PropTypes.object.isRequired
}

export default CreateWalletButton
