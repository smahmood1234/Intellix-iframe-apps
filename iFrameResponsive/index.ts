import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class iFrameResponsive implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private button: HTMLButtonElement;
    private iframeContainer: HTMLDivElement;
    private iframe: HTMLIFrameElement;
    private isInitialized: boolean;
    private isIframeOpen: boolean;
    private buttonClickHandler: () => void;
    private originalButtonText: string;

    constructor() {
        this.isInitialized = false;
        this.isIframeOpen = false;
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        context.mode.trackContainerResize(true);
        this.container = container;
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Initialize the control UI only once
        if (!this.isInitialized) {
            this.createUI(context);
            this.isInitialized = true;
        }

        // Update button text - use default "Agent1" if no value is set
        const buttonText = context.parameters.buttonText?.raw || "Agent1";
        this.originalButtonText = buttonText; // Store the current button text
        
        if (this.button) {
            // Set button text based on iframe state
            if (this.isIframeOpen) {
                this.button.textContent = "Close";
            } else {
                this.button.textContent = this.originalButtonText;
            }
        }

        // Apply button styling
        this.applyButtonStyling(context);

        // Update iframe width if provided
        const iframeWidth = context.parameters.iframeWidth?.raw || "50%";
        if (this.iframeContainer) {
            this.iframeContainer.style.width = iframeWidth;
        }

    }

    private createUI(context: ComponentFramework.Context<IInputs>): void {
        // Create main container (invisible wrapper)
        this.container.className = "iciframe-container";
        this.container.style.display = "contents";
        this.container.style.margin = "0";
        this.container.style.padding = "0";
        
        // Create button
        this.button = document.createElement("button");
        this.button.className = "iciframe-button";
        this.originalButtonText = context.parameters.buttonText?.raw || "Agent1";
        this.button.textContent = this.originalButtonText;
        this.button.style.display = "flex";
        this.button.style.visibility = "visible";
        this.button.style.opacity = "1";
        
        // Add click event listener
        this.buttonClickHandler = () => {
            this.toggleIframe(context);
        };
        this.button.addEventListener("click", this.buttonClickHandler);

        // Create iframe container (initially hidden)
        this.iframeContainer = document.createElement("div");
        this.iframeContainer.className = "iciframe-iframe-container";
        this.iframeContainer.style.width = context.parameters.iframeWidth?.raw || "50%";

        // Create iframe
        this.iframe = document.createElement("iframe");
        this.iframe.className = "iciframe-iframe";

        // Assemble iframe container
        this.iframeContainer.appendChild(this.iframe);

        // Add to DOM
        this.container.appendChild(this.button);
        document.body.appendChild(this.iframeContainer);
    }

    private toggleIframe(context: ComponentFramework.Context<IInputs>): void {
        const targetUrl = context.parameters.targetUrl?.raw;
        
        if (!targetUrl) {
            alert("Please provide a valid URL in the Target URL property.");
            return;
        }

        if (this.isIframeOpen) {
            this.closeIframe(context);
        } else {
            this.openIframe(targetUrl);
        }
    }

    private openIframe(url: string): void {
        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            // If URL is invalid, try adding https://
            if (!url.startsWith("http://") && !url.startsWith("https://")) {
                url = "https://" + url;
            }
        }

        // Set iframe source
        this.iframe.src = url;
        
        // Show iframe container first
        this.iframeContainer.classList.add("show");
        this.isIframeOpen = true;
        
        // Set dynamic height after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setDynamicHeight();
        }, 100);
        
        // Update button text to indicate close action
        this.button.textContent = "Close";
        
        // Add resize listener to update height when window resizes
        window.addEventListener('resize', this.setDynamicHeight);
    }

    private closeIframe(context: ComponentFramework.Context<IInputs>): void {
        // Hide iframe container
        this.iframeContainer.classList.remove("show");
        this.isIframeOpen = false;
        
        // Clear iframe source
        this.iframe.src = "";
        
        // Remove resize listener
        window.removeEventListener('resize', this.setDynamicHeight);
        
        // Immediately restore button text
        if (this.button) {
            this.button.textContent = this.originalButtonText;
        }
    }

    private applyButtonStyling(context: ComponentFramework.Context<IInputs>): void {
        if (!this.button) return;

        // Reset size classes from button
        this.button.classList.remove("size-small", "size-medium", "size-large", "size-extra-large");

        // Apply button size
        const buttonSize = context.parameters.buttonSize?.raw?.toLowerCase();
        if (buttonSize) {
            switch (buttonSize) {
                case "small":
                case "s":
                    this.button.classList.add("size-small");
                    break;
                case "medium":
                case "m":
                    this.button.classList.add("size-medium");
                    break;
                case "large":
                case "l":
                    this.button.classList.add("size-large");
                    break;
                case "extra-large":
                case "xl":
                    this.button.classList.add("size-extra-large");
                    break;
                default:
                    // Custom size - apply padding and font size
                    if (buttonSize.includes("px")) {
                        this.button.style.padding = buttonSize;
                    }
                    break;
            }
        }
        // Apply button width and height
        const buttonWidth = context.parameters.buttonWidth?.raw || "100px";
        const buttonHeight = context.parameters.buttonHeight?.raw || "40px";
        
        if (buttonWidth && buttonWidth.trim() !== "") {
            this.button.style.setProperty("width", buttonWidth, "important");
        }
        if (buttonHeight && buttonHeight.trim() !== "") {
            this.button.style.setProperty("height", buttonHeight, "important");
        }

        // Apply button background color
        const buttonColor = context.parameters.buttonColor?.raw;
        if (buttonColor) {
            this.button.style.backgroundColor = buttonColor;
            
            // Generate hover color (darker version)
            const hoverColor = this.darkenColor(buttonColor, 20);
            this.button.style.setProperty("--hover-color", hoverColor);
        }

        // Apply button text color
        const buttonTextColor = context.parameters.buttonTextColor?.raw;
        if (buttonTextColor) {
            this.button.style.color = buttonTextColor;
        }

        // Apply font size
        const buttonFontSize = context.parameters.buttonFontSize?.raw;
        if (buttonFontSize) {
            this.button.style.fontSize = buttonFontSize;
        }

        // Apply font family
        const buttonFontFamily = context.parameters.buttonFontFamily?.raw;
        if (buttonFontFamily) {
            this.button.style.fontFamily = buttonFontFamily;
        }

        // Apply border styling
        const buttonBorderWidth = context.parameters.buttonBorderWidth?.raw;
        if (buttonBorderWidth) {
            this.button.style.borderWidth = buttonBorderWidth;
        }

        const buttonBorderStyle = context.parameters.buttonBorderStyle?.raw;
        if (buttonBorderStyle) {
            this.button.style.borderStyle = buttonBorderStyle;
        }

        const buttonBorderColor = context.parameters.buttonBorderColor?.raw;
        if (buttonBorderColor) {
            this.button.style.borderColor = buttonBorderColor;
        }

        const buttonBorderRadius = context.parameters.buttonBorderRadius?.raw;
        if (buttonBorderRadius) {
            this.button.style.borderRadius = buttonBorderRadius;
        }

        // Apply custom styles
        const buttonCustomStyle = context.parameters.buttonCustomStyle?.raw;
        if (buttonCustomStyle) {
            // Parse and apply custom CSS
            const styles = buttonCustomStyle.split(';');
            styles.forEach(style => {
                const [property, value] = style.split(':').map(s => s.trim());
                if (property && value) {
                    this.button.style.setProperty(property, value);
                }
            });
        }
    }

    private setDynamicHeight = (): void => {
        if (this.iframeContainer && this.iframe) {
            // Use window inner height for better cross-browser compatibility
            const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            
            // Set iframe height to match window height
            this.iframeContainer.style.height = `${windowHeight}px`;
            this.iframe.style.height = `${windowHeight}px`;
        }
    }

    private darkenColor(color: string, percent: number): string {
        // Simple color darkening function
        if (color.startsWith('#')) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        }
        return color; // Return original if not hex color
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Clean up event listeners
        if (this.button && this.buttonClickHandler) {
            this.button.removeEventListener("click", this.buttonClickHandler);
        }
        
        // Remove resize listener
        window.removeEventListener('resize', this.setDynamicHeight);

        // Remove iframe container from DOM
        if (this.iframeContainer && this.iframeContainer.parentNode) {
            this.iframeContainer.parentNode.removeChild(this.iframeContainer);
        }
    }
}