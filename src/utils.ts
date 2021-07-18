const truncateInnerText = (
    domElement: HTMLElement ,
    elementInnerText: string,
    maxNumberOfLines: number,
    maxWidth: string
  ) => {
    domElement.style.overflow = "auto";
  
    const maxHeight =
      Number(window.getComputedStyle(domElement).lineHeight.slice(0, -2)) *
      maxNumberOfLines;
  
    if (maxWidth) {
      domElement.style.width = maxWidth;
    }
  
    const letters = elementInnerText.split("");
    if (domElement.clientHeight <= maxHeight) {
      domElement.style.overflow = "hidden";
      return;
    }
  
    let left = 0,
      right = letters.length / 2;
  
    while (left <= right) {

        const mid = Math.floor(left + (right - left) / 2);

      const leftletters = letters.filter((_, ind) => ind < mid);
      const rightletters = letters.filter(
        (_, ind) => ind >= letters.length - mid
      );
  
      const previousInnerText = domElement.innerText;
  
      domElement.innerText = leftletters.join("") + "..." + rightletters.join("");
  
      if (domElement.clientHeight <= maxHeight) {
        left = mid + 1;
      } else {
        domElement.innerText = previousInnerText;
        right = mid - 1;
      }
    }
  
    domElement.style.overflow = "hidden";
  };

const eventDeboune = (eventHandler: (...args: any[]) => any) => {
    let timer: any;
    return function (this: any ,...args: any[]) {
      let self = this;
      if (timer) {
        cancelAnimationFrame(timer);
      }
      timer = requestAnimationFrame(() => {
        eventHandler.apply(self, [...args]);
        timer = undefined;
      });
    };
  };
  
export {truncateInnerText, eventDeboune};