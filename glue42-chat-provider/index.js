var historyByTopicId = {
  testRoomTopic: {
    topic: 'testRoomTopic',
    messages: [
      {
        id: 'unique id 1',
        author: 'Auto Generated',
        publicationTime: '2019-11-06T10:45:18+02:00',
        text: `Subscribed to testRoomTopic room! 
        When new messages are sent to the group you will now see them listed below.`,
      },
    ],
  },
  finance: {
    topic: 'finance',
    messages: [
      {
        id: 'unique id 3',
        author: 'Finance Author',
        publicationTime: '2019-11-03T10:45:18+02:00',
        text: 'finance text message',
      },
      {
        id: 'unique id 4',
        author: 'Finance Author 2',
        publicationTime: '2019-11-02T10:45:18+02:00',
        text: 'finance text',
      },
    ],
  },
}

const addMessageToHistory = message => {
  if (historyByTopicId[message.room]) {
    historyByTopicId[message.room].messages = historyByTopicId[
      message.room
    ].messages.concat(message)
  } else {
    historyByTopicId[message.room] = {
      topic: message.room,
      messages: [message],
    }
  }
}

Glue({ agm: true })
  .then(glue => {
    window.glue = glue

    const streamDefinition = {
      name: 'Glue42.Chat',
      accepts: 'String roomTopic',
      returns:
        'String room, Composite:{String messageAuthor, String publicationTime, String messageText}[]',
      description: 'The default Glue42 Chat Stream',
      supportsStreaming: true,
    }

    const subscriptionRequestHandler = subscriptionRequest => {
      console.log(
        'TCL:subscriptionRequestHandler -> subscriptionRequest',
        subscriptionRequest
      )
      subscriptionRequest.acceptOnBranch(
        subscriptionRequest.arguments.roomTopic
      )
    }

    const subscriptionAddedHandler = streamSubscription => {
      console.log(
        'TCL:subscriptionAddedHandler -> streamSubscription',
        streamSubscription
      )
    }

    const subscriptionRemovedHandler = streamSubscription => {
      console.log(
        'TCL:subscriptionRemovedHandler -> streamSubscription',
        streamSubscription
      )
    }

    const streamOptions = {
      subscriptionRequestHandler,
      subscriptionAddedHandler,
      subscriptionRemovedHandler,
    }

    // create chat stream
    glue.agm
      .createStream(streamDefinition, streamOptions)
      .then(stream => {
        const methodDefinition = {
          name: 'Glue42.Chat.Send.Message',
          accepts: 'String messageText, String publicationTime, String room',
          returns:
            'Composite: { String topic, Composite: {String id, String author, string publicationTime, String text }[] messages }[] historyByTopicId',
        }

        // register interop method for chat messages to arrive and then push to stream registered above
        glue.agm.register(methodDefinition, (args, caller) => {
          // handler function
          const branchToPushMessageTo = stream
            .branches()
            .find(({ key }) => key === args.room)

          if (branchToPushMessageTo) {
            const author = caller.user + caller.instance
            const id = uuidv4()
            const message = {
              id,
              author,
              publicationTime: args.publicationTime,
              text: args.messageText,
            }

            addMessageToHistory({ ...message, room: args.room })

            branchToPushMessageTo.push(message)
          }

          return { historyByTopicId }
        })
      })
      .catch(console.error)
  })
  .catch(console.error)
