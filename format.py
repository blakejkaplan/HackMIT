with open("names.txt", "r") as ins:
    array = []
    for line in ins:
		print "\"" + line.strip() + "\","