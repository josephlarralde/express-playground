class Something {
  constructor(name = 'Jack') {
    this._name = name;
  }

  doSomething() {
    console.log(`hello my name is ${this._name}`);
    console.log('and more words for the pleasure');
  }
}

export default Something;