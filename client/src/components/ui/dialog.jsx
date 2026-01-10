import * as React from "react"

const DialogContext = React.createContext()

const Dialog = ({ children, open, onOpenChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)

  React.useEffect(() => {
    setIsOpen(open || false)
  }, [open])

  const handleOpenChange = (newOpen) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <DialogContext.Provider value={{ isOpen, handleOpenChange }}>
      <div {...props}>
        {children}
      </div>
    </DialogContext.Provider>
  )
}

const DialogTrigger = React.forwardRef(({ className, children, asChild, ...props }, ref) => {
  const { handleOpenChange } = React.useContext(DialogContext)
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: (e) => {
        children.props.onClick?.(e)
        props.onClick?.(e)
        handleOpenChange(true)
      }
    })
  }
  
  return (
    <button
      ref={ref}
      onClick={() => handleOpenChange(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  const { isOpen, handleOpenChange } = React.useContext(DialogContext)
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={() => handleOpenChange(false)}
      />
      
      {/* Dialog */}
      <div
        ref={ref}
        className={`
          relative z-50 w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
DialogContent.displayName = "DialogContent"

const DialogHeader = ({ className, ...props }) => (
  <div
    className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 pb-4 ${className}`}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div
    className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6 pt-4 ${className}`}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
