var historyByTopicId = {
  'testRoomTopic': {
    topic: 'testRoomTopic',
    messages: [
      {
        id: 'unique id 1',
        author: 'Test Author',
        publicationTime: '2019-11-06T10:45:18+02:00',
        text: 'text message example text',
      },
      {
        id: 'unique id 2',
        author: 'Test Author 2',
        publicationTime: '2019-11-07T10:45:18+02:00',
        text: 'some random text',
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

Glue({
  agm: true,
})
  .then(glue => {
    window.glue = glue

    const streamDefinition = {
      name: 'Glue42.Chat',
      accepts: 'String room, String username',
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
      subscriptionRequest.acceptOnBranch(subscriptionRequest.arguments.room)
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
        // TODO get whatever was pushed below and then return the history in return format from above
        console.log('TCL: stream', stream)

        const methodDefinition = {
          name: 'Glue42.Chat.Send.Message',
          accepts: 'String messageText, String publicationTime',
          // returns: '', // optional
        }

        // register interop method for chat messages to arrive and then push to stream registered above
        glue.agm.register(methodDefinition, (args, caller) => {
          // required - handler function
          console.log('TCL: args', args)
          console.log('TCL: caller', caller)
          // TODO pass caller.instance, args.messageAuthor, args.publicationTime
          // TODO args.messageText, args.room to the steam
          console.log('TCL: stream.branches()', stream.branches())
          console.log('TCL: args.room', args.room)
          const branchToPushMessageTo = stream
            .branches()
            .find(({ key }) => key === args.room)

          if (branchToPushMessageTo) {
            console.log('TCL: branchToPushMessageTo', branchToPushMessageTo)
            const messageAuthor = caller.user + caller.instance
            const message = {
              author: args.author,
              room: args.room,
              callerId: caller.instance,
              messageAuthor,
              publicationTime: args.publicationTime,
              messageText: args.messageText,
            }

            const messageForDb = {
              id: args.id,
              author: messageAuthor,
              publicationTime: args.publicationTime,
              text: args.messageText,
              room: args.room,
            }
            console.log('TCL: message', message)
            addMessageToHistory(messageForDb)

            console.log('TCL: historyByTopicId', historyByTopicId)

            branchToPushMessageTo.push(message)
          }

          return { historyByTopicId } // optional
        })
      })
      .catch(console.error)
  })
  .catch(console.error)
