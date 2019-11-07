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
            branchToPushMessageTo.push({
              room: args.room,
              callerId: caller.instance,
              messageAuthor: args.messageAuthor,
              publicationTime: args.publicationTime,
              messageText: args.messageText,
            })
          }

          // return {} // optional
        })
      })
      .catch(console.error)
  })
  .catch(console.error)
