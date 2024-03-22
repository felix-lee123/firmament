import React, { useEffect, useState } from 'react';
import { useStella } from '@site/src/components/Stella/UseStella'

function Chatbot(props) {
  useStella("http://dev.radiate.sanuker.com/webchat.js", props.channelId, props.token);
  return (
    <div className="application">
    </div>
  )
}

export default Chatbot;

