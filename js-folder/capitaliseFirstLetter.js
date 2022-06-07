function capitaliseFirstLetter(x){
    const toCapitalise = x.split(" ");
    let capitalisedString = "";
    for (var i = 0; i < toCapitalise.length; i++) {
      toCapitalise[i] = toCapitalise[i].charAt(0).toUpperCase() + toCapitalise[i].slice(1);
      capitalisedString = toCapitalise.join(" ");
    }
        return capitalisedString;
  }